import { v4 as uuid } from 'uuid'
import { User } from './User'

import { 
   Entity, 
   Column, 
   CreateDateColumn,
   PrimaryColumn,
   ManyToOne,
   JoinColumn
 } from 'typeorm'

@Entity("messages")
class Message {

   @PrimaryColumn()
   id: string;

   @Column()
   admin_id: string;

   @Column()
   user_id: string;
   
   @Column()
   text: string;

   @JoinColumn({ name: "user_id" })
   @ManyToOne(() => User)
   user: User;

   @CreateDateColumn()
   created_at: Date;

   constructor() {
      if (!this.id) {
         this.id = uuid();
      }
   }
}

export { Message }