declare module "react-native-markdown-package" {
  import { ComponentType } from "react";
    import { TextStyle, ViewStyle } from "react-native";

  interface MarkdownStyles {
    text?: TextStyle;
    strong?: TextStyle;
    em?: TextStyle;
    del?: TextStyle;
    heading1?: TextStyle;
    heading2?: TextStyle;
    heading3?: TextStyle;
    heading4?: TextStyle;
    heading5?: TextStyle;
    heading6?: TextStyle;
    link?: TextStyle;
    listItemNumber?: TextStyle;
    listItemBullet?: TextStyle;
    blockquote?: ViewStyle & TextStyle;
    codeBlock?: TextStyle;
    inlineCode?: TextStyle;
    table?: ViewStyle;
    tableHeader?: ViewStyle;
    tableHeaderCell?: TextStyle;
    tableRow?: ViewStyle;
    tableCell?: TextStyle;
    hr?: ViewStyle;
    image?: ViewStyle;
    view?: ViewStyle;
  }

  interface MarkdownProps {
    children: string;
    styles?: MarkdownStyles;
    onLink?: (url: string) => void;
  }

  const Markdown: ComponentType<MarkdownProps>;
  export default Markdown;
}
