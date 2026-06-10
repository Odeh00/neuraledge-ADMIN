import CollectionEditor from "../components/CollectionEditor";
const fields = [
  { key: "name", label: "Full name" }, { key: "role", label: "Role / title" },
  { key: "bio", label: "Biography", type: "textarea", wide: true },
  { key: "tags", label: "Skills (comma separated)", type: "tags", wide: true },
  { key: "badge", label: "Badge label" }, { key: "displayOrder", label: "Display order", type: "number" },
  { key: "active", label: "Visibility", type: "toggle", wide: true },
];
export default function Team(props) { return <CollectionEditor {...props} title="Team" eyebrow="Website content" description="Manage team profiles and their display order." fields={fields} />; }
