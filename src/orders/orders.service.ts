import {
    ConflictException,
    Injectable,
    NotFoundException,
    BadRequestException
    } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { DataSource, Repository } from 'typeorm';
    import { Order, OrderStatus } from './order.entity';
    import { OrderAssignment } from './order-assignment.entity';

    @Injectable()
    export class OrdersService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(OrderAssignment)
        private readonly assignmentRepo: Repository<OrderAssignment>
    ) {}

    async createOrder() {
        const order = this.orderRepo.create({
        status: OrderStatus.CREATED
        });
        return this.orderRepo.save(order);
    }

    async startOrder(orderId: string, riderId: string) {
        return this.dataSource.transaction(async manager => {
        const order = await manager.findOne(Order, {
            where: { id: orderId },
            lock: { mode: 'pessimistic_write' }
        });

        if (!order) throw new NotFoundException('Order not found');

        if (order.status === OrderStatus.COMPLETED) {
            throw new BadRequestException('Order already completed');
        }

        if (order.status === OrderStatus.IN_PROGRESS) {
            if (order.currentRiderId === riderId) {
            return order; // idempotent
            }
            throw new ConflictException('Order already in progress');
        }

        const assignment = this.assignmentRepo.create({
            orderId,
            riderId
        });

        await manager.save(assignment);

        order.status = OrderStatus.IN_PROGRESS;
        order.currentRiderId = riderId;

        return manager.save(order);
        });
    }

    async finishOrder(orderId: string, riderId: string) {
        return this.dataSource.transaction(async manager => {
        const order = await manager.findOne(Order, {
            where: { id: orderId },
            lock: { mode: 'pessimistic_write' }
        });

        if (!order) throw new NotFoundException('Order not found');

        if (order.status !== OrderStatus.IN_PROGRESS) {
            return order; // idempotent / out-of-order safe
        }

        if (order.currentRiderId !== riderId) {
            throw new ConflictException('Rider mismatch');
        }

        const assignment = await manager.findOne(OrderAssignment, {
            where: { orderId, riderId, finishedAt: null }
        });

        if (assignment) {
            assignment.finishedAt = new Date();
            await manager.save(assignment);
        }

        order.status = OrderStatus.CREATED;
        order.currentRiderId = null;

        return manager.save(order);
        });
    }
    }