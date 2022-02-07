import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Song {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  src: string;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  artist: string;

  @Column({ type: "text" })
  img: string;

}