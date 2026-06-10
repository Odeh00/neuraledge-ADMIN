import CollectionEditor from "../components/CollectionEditor";
const fields = [
  { key: "title", label: "Title" }, { key: "accuracy", label: "Accuracy metric" },
  { key: "summary", label: "Abstract / summary", type: "textarea", wide: true },
  { key: "publicationDate", label: "Publication date", type: "date" }, { key: "link", label: "Publication link" },
  { key: "tags", label: "Tags (comma separated)", type: "tags", wide: true },
  { key: "active", label: "Visibility", type: "toggle", wide: true },
];
export default function Research(props) { return <CollectionEditor {...props} title="Research" eyebrow="Website content" description="Curate publications, benchmarks, and applied research." fields={fields} />; }
