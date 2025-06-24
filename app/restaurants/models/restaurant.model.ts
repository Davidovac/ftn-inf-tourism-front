import { User } from "../../users/model/user.model";

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status?: string;
  ownerId: number;
  owner?: User;
}
