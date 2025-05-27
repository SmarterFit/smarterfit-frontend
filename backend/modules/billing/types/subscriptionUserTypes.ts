import { UserResponseDTO } from "../../useraccess/types/userTypes";
import { SubscriptionResponseDTO } from "./subscriptionTypes";

export interface SubscriptionUserResponseDTO {
   user: UserResponseDTO;
   subscription: SubscriptionResponseDTO;
}
