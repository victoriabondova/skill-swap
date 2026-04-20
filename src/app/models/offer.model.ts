export interface Offer {
  id?: string;
  title: string;
  offering: string;
  seeking: string;
  category: string;
  description: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  status: 'active' | 'closed';
}