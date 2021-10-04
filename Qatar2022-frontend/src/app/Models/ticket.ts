import { MatchEntity } from "./match";

export interface TicketEntity{
    id?: number;
    price: number;
    ticketType: string;
    ticketNumber: string;
    match: any;
}

