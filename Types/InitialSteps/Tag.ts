export interface Tag {
  id: string;
  name: string;
  food?: TagsOnFoods[];
}

export interface TagsOnFoods {
  tagId: string;
  foodId: string;
  food: Food;
  tag: Tag;
}

export interface Food {
  id: string;
  name: string;
  altName: string;
  country: string;
  img: string;
  tag: TagsOnFoods[];
}
