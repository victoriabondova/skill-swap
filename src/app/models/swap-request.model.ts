export interface SwapRequest {
  id?: string;
  offerId: string;
  offerTitle: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}