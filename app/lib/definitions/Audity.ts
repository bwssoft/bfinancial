import { v4 as uuid } from 'uuid';

export type IAudit = {
  uuid: string;
  created_at: Date;
  operation: string
  metadata: any
}

type IInitializeAudit = Partial<Omit<IAudit, 'uuid' | 'created_at'>>; 

export class AuditEntity implements IInitializeAudit {
  
  readonly uuid?: string;
  readonly created_at?: Date;
  readonly operation?: string;
  readonly metadata?: any;

  constructor(data: IInitializeAudit) {
    Object.assign(this, {
      ...data,
      created_at: new Date(),
      uuid: uuid()
    } as IAudit);
  }

}