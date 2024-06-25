import React from "react";

export interface Tab {
  component: React.FC<any>;
  name: string;
}

export interface Props {
  heading: string;
  components: Tab[];
}
