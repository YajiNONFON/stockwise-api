import { Provider } from "../../../generated/prisma/enums";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: Provider;
  providerId: string;
  acceptTerms: boolean;
  createdAt: Date;
}
