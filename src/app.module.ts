import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderAssignment } from './orders/order-assignment.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'handoff',
        synchronize: true,
        entities: [Order, OrderAssignment]
        }),
        OrdersModule
    ]
})
export class AppModule {}