import { Author, Category } from "@/lib/type";


export const mockAuthors: Author[] = [
  {
    name: "Salim Ahmed Shuvo",
    title: "Editor",
    src: "https://res.cloudinary.com/dvzguci6p/image/upload/v1773353725/Ekushey71/News/rap0aqgyll0sl02n4rvh.jpg",
    location: "Netrokona",
  },
];

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
