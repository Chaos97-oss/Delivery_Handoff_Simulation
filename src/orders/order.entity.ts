
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    VersionColumn,
    CreateDateColumn,
    UpdateDateColumn
    } from 'typeorm';

    export enum OrderStatus {
    CREATED = 'CREATED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
    }

    @Entity()
    export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus;

    @Column({ nullable: true })
    currentRiderId?: string;

    @VersionColumn()
    version: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}