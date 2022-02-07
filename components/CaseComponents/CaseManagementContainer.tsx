import React from "react";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import "../../styles/casemanagement.module.css";
import CaseCategory from "./CaseCategory";
import AddCaseModal from "./Modals/AddCaseModal";
import { useQuery } from "urql";
import AddCategoryModal from "./Modals/AddCategoryModal";
import AddTagModal from "./Modals/AddTagModal";
import ProgressBar from "react-bootstrap/ProgressBar";
import caseManagementStyle from "../../styles/casemanagement.module.css";
import { DEFAULT_DEPRECATION_REASON } from "graphql";


/* Feature 1 */

export const ManagementContainerQuery = `
  query QueryCases {
    category {
      id
      name
    }
  }
`;

export const queryCaseStatus = `
query MyQuery {
  cases {
    status
  }
}`;

export const queryExistingCase = `
query queryExistingCase {
  cases {
    id
    name
    description
    status
  }
}
`;

export type ManagementCase = {
  id: number;
  name: string;
  description: string;
  status: string;
}

export type ManagementCategory = {
  id: number;
  name: string;
};

const CaseManagementContainer: React.FC = (props) => {
  const [addCaseModalOpen, setAddCaseModalOpen] = React.useState<boolean>(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = React.useState<boolean>(false);
  const [addTagModalOpen, setAddTagModalOpen] = React.useState<boolean>(false);
  
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });

  return (
    <>
      <h2 className="title">Your Case Management System</h2>

      {/* Feature 1 part 2 */}

      <Grid container spacing={3}>
        {
          data ? data.category.map((category: ManagementCategory) => {
            return <Grid item xs={4}><CaseCategory category_id={category.id} /> </Grid>;
          }) : "Loading Cases..."}
      </Grid>

      <AddCaseModal
        onClose={() => setAddCaseModalOpen(false)}
        open={addCaseModalOpen}
      />

      <AddCategoryModal
        onClose={() => setAddCategoryModalOpen(false)}
        open={addCategoryModalOpen}
      />

      <AddTagModal
        onClose={() => setAddTagModalOpen(false)}
        open={addTagModalOpen}
      />
    </>
  );
};

export default CaseManagementContainer;
