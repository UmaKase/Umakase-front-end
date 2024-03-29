export interface Tag {
  id: string;
  name: string;
  food: TagsOnFoods[];
}

export interface TagCheck extends Tag {
  checked?: boolean;
}

export interface TagsOnFoods {
  tagId: string;
  foodId: string;
  food: Food;
  tag: Tag;
}

export interface Food {
  altName: string;
  country: string;
  createdAt: string;
  id: string;
  img: string;
  name: string;
  updatedAt: string; // Generated by https://quicktype.io
}
export interface FoodCheck extends Food {
  checked?: boolean;
}

export type BookMarkFood = {
  altName: string;
  country: string;
  createdAt: string;
  id: string;
  img: string;
  name: string;
  tags: Tag[];
  updatedAt: string;
};

export type BookMarkTag = {
  foodId: string;
  tagId: string;
};
