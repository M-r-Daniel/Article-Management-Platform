export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateArticleInput = Omit<
  Article,
  'id' | 'slug' | 'createdAt' | 'updatedAt' | 'status' | 'views'
>;
export type UpdateArticleInput = {
  [K in keyof (CreateArticleInput & { status: Article['status'] })]?:
    | (CreateArticleInput & { status: Article['status'] })[K]
    | undefined;
};
