import React from "react";
import { Container } from "reactstrap";
import Button from "react-bootstrap/Button";
import AddCategoryModal from "./Modals/AddCategoryModal";
import AddTagModal from "./Modals/AddTagModal";
import AddCaseModal from "./Modals/AddCaseModal";
import DeleteCategoryModal from "./Modals/DeleteCategoryModal";
import EditCaseModal from "./Modals/EditCaseModal";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useQuery } from "urql";
import { queryCaseStatus } from "./CaseManagementContainer";

async function getCategories(data) {
  if (data == null)
    return null;

  let cases = data.cases;
  let retarr = [0, 0, 0, 0];

  for (let i = 0; i < cases.length; i++) {
    if (cases[i].status === "Done") {
      retarr[0]++;
    } else if (cases[i].status === "In Progress") {
      retarr[1]++;
    } else {
      retarr[2]++;
    }
    retarr[3]++;
  }
  return retarr;
}

const Footer: React.FC = () => {

  let [addTagModalOpen, setAddTagModalOpen] = React.useState<boolean>(false);
  let [addCaseModalOpen, setAddCaseModalOpen] = React.useState<boolean>(false);
  let [addCategoryModalOpen, setAddCategoryModalOpen] = React.useState<boolean>(false);
  let [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = React.useState<boolean>(false);
  let [EditCaseModalOpen, setEditCaseModalOpen] = React.useState<boolean>(false);
  let [TasksDone, setTasksDone] = React.useState<number>(0);
  let [TasksInProg, setTasksInProg] = React.useState<number>(0);
  let [TasksToDo, setTasksToDo] = React.useState<number>(0);
  let [percentTasksDone, setPercentTasksDone] = React.useState<number>(0);
  let [percentTasksInProg, setPercentTasksInProg] = React.useState<number>(0);
  let [percentTasksToDo, setPercentTasksToDo] = React.useState<number>(0);
  let [totalTasks, setTotalTasks] = React.useState<number>(0);

  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: queryCaseStatus,
  });

  const stats = getCategories(data).then(function (result) {
    if (result == null) {
      return;
    }
    setTasksDone(result[0]);
    setTasksInProg(result[1]);
    setTasksToDo(result[2]);
    setTotalTasks(result[3]);
    setPercentTasksDone(Math.round((result[0] / result[3]) * 100));
    setPercentTasksInProg(Math.round((result[1] / result[3]) * 100));
    setPercentTasksToDo(Math.round((result[2] / result[3]) * 100));
  });

  return (
    
    <div className="footer">
      {<ProgressBar style = {{marginRight: "2rem", marginTop: "1rem", marginBottom: "1rem", width: "40%", height: '1.6rem'}}>
          <ProgressBar variant="info" now={percentTasksDone} label={`${percentTasksDone}% Done`} key={1} />
          <ProgressBar variant="success" now={percentTasksInProg} key={2} label={`${percentTasksInProg}% In-Prog`}/>
          <ProgressBar variant="warning" now={percentTasksToDo} key={3} label={`${percentTasksToDo}% To-Do`} />
        </ProgressBar>}

      <div className = "footer-buttons">
        <Button variant="dark" className="mx-2" onClick={() => setAddCategoryModalOpen(true)}>
          Add Category
        </Button>
        {/* <Button variant="dark" className="mx-2" onClick={() => setAddTagModalOpen(true)}>
          Add Tag To A Case
        </Button> */}
        <Button variant="dark" className="mx-2" onClick={() => setAddCaseModalOpen(true)}>
          Add Case
        </Button>
        <Button variant="dark" className="mx-2" onClick={() => setDeleteCategoryModalOpen(true)}>
          Delete Category
        </Button>
      </div>

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

      <DeleteCategoryModal
        onClose={() => setDeleteCategoryModalOpen(false)}
        open={deleteCategoryModalOpen}
      />

      <EditCaseModal
        onClose={() => setEditCaseModalOpen(false)}
        open={EditCaseModalOpen}
      />
  </div>
  );
};

export default Footer;
