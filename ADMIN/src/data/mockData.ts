export interface Author {
  name: string;
  title: string;
  src: string;
  location: string;
}

export interface Post {
  _id?: string;
  id?: string;
  bnTitle: string;
  enTitle: string;
  slug: string;
  content: string;
  categoryEN: string;
  categoryBN: string;
  featuredImage?: string;
  imageCaption?: string;
  tags?: string[];
  author: Author;
  status: string;
  date?: string;
}

export interface Category {
  id: string;
  nameEN: string;
  nameBN: string;
  postCount: number;
}


export const mockAuthors: Author[] = [
  {
    name: "মোঃ তানভীর হাসান",
    title: "Editor",
    src: "https://images.unsplash.com/photo-1603415526960-f4e5d0a8ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
    location: "চট্টগ্রাম",
  },
  {
    name: "ফাতেমা আক্তার",
    title: "Reporter",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
    location: "ঢাকা",
  },
  {
    name: "রাহুল দাস",
    title: "Correspondent",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
    location: "সিলেট",
  },
];

export const mockCategories: Category[] = [
  { id: "1", nameEN: "Politics", nameBN: "রাজনীতি", postCount: 24 },
  { id: "2", nameEN: "Sports", nameBN: "খেলাধুলা", postCount: 18 },
  { id: "3", nameEN: "Technology", nameBN: "প্রযুক্তি", postCount: 12 },
  { id: "4", nameEN: "Entertainment", nameBN: "বিনোদন", postCount: 15 },
  { id: "5", nameEN: "Economy", nameBN: "অর্থনীতি", postCount: 20 },
  { id: "6", nameEN: "International", nameBN: "আন্তর্জাতিক", postCount: 9 },
  { id: "7", nameEN: "Education", nameBN: "শিক্ষা", postCount: 7 },
  { id: "8", nameEN: "Health", nameBN: "স্বাস্থ্য", postCount: 6 },
];

// export const mockPosts: Post[] = [
//   {
//     id: "1",
//     bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
//     enTitle: "hello test this case",
//     slug: "new-election-commission",
//     content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
//     categoryEN: "Politics",
//     categoryBN: "রাজনীতি",
//     author: mockAuthors[0],
//     status: "published",
//     date: "2026-03-10",
//   },
//   {
//     id: "2",
//     bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
//     enTitle: "hello test this case",
//     slug: "new-election-commission",
//     content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
//     categoryEN: "Politics",
//     categoryBN: "রাজনীতি",
//     author: mockAuthors[0],
//     status: "published",
//     date: "2026-03-10",
//   },
//   {
//     id: "3",
//     bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
//     enTitle: "hello test this case",
//     slug: "new-election-commission",
//     content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
//     categoryEN: "Politics",
//     categoryBN: "রাজনীতি",
//     author: mockAuthors[0],
//     status: "draft",
//     date: "2026-03-10",
//   },
//   {
//     id: "4",
//     bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
//     enTitle: "hello test this case",
//     slug: "new-election-commission",
//     content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
//     categoryEN: "Politics",
//     categoryBN: "রাজনীতি",
//     author: mockAuthors[0],
//     status: "draft",
//     date: "2026-03-10",
//   },
//   {
//     id: "5",
//     bnTitle: "জাতীয় নির্বাচনে নতুন কমিশন গঠন",
//     enTitle: "hello test this case",
//     slug: "new-election-commission",
//     content: "জাতীয় নির্বাচনে নতুন কমিশন গঠিত হয়েছে। নতুন কমিশনের সদস্যরা তাদের দায়িত্ব পালন শুরু করেছেন।",
//     categoryEN: "Politics",
//     categoryBN: "রাজনীতি",
//     author: mockAuthors[0],
//     status: "published",
//     date: "2026-03-10",
//   },
// ];

export const mockUserProfile = {
  name: "মোঃ তানভীর হাসান",
  email: "tanvir@ekushey71.com",
  bio: "Ekushey 71 এর প্রধান সম্পাদক। সাংবাদিকতায় ১৫ বছরের অভিজ্ঞতা।",
  avatar: "https://images.unsplash.com/photo-1603415526960-f4e5d0a8ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
  role: "প্রধান সম্পাদক",
  joinDate: "2024-01-15",
};

export const mockSettings = {
  siteName: "Ekushey 71",
  siteDescription: "বাংলাদেশের শীর্ষস্থানীয় সংবাদপত্র",
  siteUrl: "https://ekushey71.com",
  postsPerPage: 10,
  allowComments: true,
  moderateComments: true,
};
