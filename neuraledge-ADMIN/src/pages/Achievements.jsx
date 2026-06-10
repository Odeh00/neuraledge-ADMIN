import CollectionEditor from "../components/CollectionEditor";
const fields = [
  { key: "title", label: "Title" }, { key: "category", label: "Category" },
  { key: "description", label: "Description", type: "textarea", wide: true },
  { key: "date", label: "Date", type: "date" }, { key: "active", label: "Visibility", type: "toggle" },
];
export default function Achievements(props) { return <CollectionEditor {...props} title="Achievements" eyebrow="Website content" description="Record milestones, client outcomes, and company progress." fields={fields} />; }
