export type AutoModel = "post" | "project" | "award" | "stack";

export type AutoPrismaScalarType = "String" | "Float" | "Boolean" | "DateTime";

export interface AutoFieldDefinition {
  notionPropertyName: string;
  notionPropertyType: string;
  prismaFieldName: string;
  prismaFieldType: AutoPrismaScalarType;
  prismaDbColumnName?: string;
}

export const autoFields: Record<AutoModel, AutoFieldDefinition[]> = {
  "post": [],
  "project": [
    {
      "notionPropertyName": "수상",
      "notionPropertyType": "relation",
      "prismaFieldName": "notion_project_수상",
      "prismaFieldType": "String",
      "prismaDbColumnName": "notionProp_c4902d28e9"
    },
    {
      "notionPropertyName": "블로그",
      "notionPropertyType": "relation",
      "prismaFieldName": "notion_project_블로그",
      "prismaFieldType": "String",
      "prismaDbColumnName": "notionProp_a1c5c9ec45"
    }
  ],
  "award": [],
  "stack": [
    {
      "notionPropertyName": "Projects",
      "notionPropertyType": "relation",
      "prismaFieldName": "notion_stack_Projects",
      "prismaFieldType": "String",
      "prismaDbColumnName": "notionProp_e4b8496f87"
    },
    {
      "notionPropertyName": "설명",
      "notionPropertyType": "rich_text",
      "prismaFieldName": "notion_stack_설명",
      "prismaFieldType": "String",
      "prismaDbColumnName": "설명"
    },
    {
      "notionPropertyName": "카테고리",
      "notionPropertyType": "select",
      "prismaFieldName": "notion_stack_카테고리",
      "prismaFieldType": "String",
      "prismaDbColumnName": "카테고리"
    }
  ]
} as const;
