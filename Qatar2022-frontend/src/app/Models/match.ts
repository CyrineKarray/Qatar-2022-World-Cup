import { TicketEntity } from "./ticket";

export interface MatchEntity{
    id:number;
    teamA: string;
    imageUrlA: string;
    teamB: string;
    imageUrlB: string;
    matchDate: Date;
    beginningTime: string;
    matchType: string;
    matchLocation: string;
    ticketEntities: TicketEntity[];
}