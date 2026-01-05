import { Controller, Post, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { StartOrderDto } from '../dto/start-order.dto';
import { FinishOrderDto } from '../dto/finish-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    createOrder() {
        return this.ordersService.createOrder();
    }

    @Post(':orderId/start')
    startOrder(
        @Param('orderId') orderId: string,
        @Body() dto: StartOrderDto
    ) {
        return this.ordersService.startOrder(orderId, dto.riderId);
    }

    @Post(':orderId/finish')
    finishOrder(
        @Param('orderId') orderId: string,
        @Body() dto: FinishOrderDto
    ) {
        return this.ordersService.finishOrder(orderId, dto.riderId);
    }
    }