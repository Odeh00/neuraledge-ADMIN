import CollectionEditor from "../components/CollectionEditor";
const fields = [
  { key: "title", label: "Title" }, { key: "icon", label: "Icon name" },
  { key: "description", label: "Short description", type: "textarea", wide: true },
  { key: "active", label: "Visibility", type: "toggle", wide: true },
];
export default function Services(props) { return <CollectionEditor {...props} title="Services" eyebrow="Website content" description="Manage the capabilities presented to prospective clients." fields={fields} />; }
