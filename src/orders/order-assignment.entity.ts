import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
    } from 'typeorm';

    @Entity()
    export class OrderAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderId: string;

    @Column()
    riderId: string;

    @CreateDateColumn()
    startedAt: Date;

    @Column({ nullable: true })
    finishedAt?: Date;
}