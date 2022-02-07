import React, { useState } from "react";
import StyledModal from "./StyledModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useMutation, useQuery } from "urql";
import {
  ManagementCategory,
  ManagementContainerQuery,
  ManagementCase,
  queryExistingCase,
} from "../CaseManagementContainer";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
  })
);

type AddCaseModalProps = {
  open: boolean;
  onClose: () => void;
}; 

const EditCaseMutation = `
  mutation EditCaseMute($id: bigint = "", $description: String = "", $name: String = "", $status: String = "", $category_id: Int = 10) {
    update_cases_by_pk(pk_columns: {id: $id}, _set: {description: $description, name: $name, status: $status, category_id: $category_id}) {
      description
      name
      status
      category_id
    }
  }
`;

const AddCaseModal: React.FC<AddCaseModalProps> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [caseElem, setCaseElem] = useState<number | null>(null);
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });
  const [caseData, executeExistingQuery] = useQuery({
    query: queryExistingCase
  });
  const [result, executeMutation] = useMutation(EditCaseMutation);

  // Initialize a markdown parser
  const mdParser = new MarkdownIt();

  // Finish!
  function handleEditorChange({ html, text }: any) {
    setDescription(text);
  }

  return (
    <StyledModal open={props.open} onClose={props.onClose}>
      <Typography variant="h4" align="center">
        Edit Case
      </Typography>
        {caseData.data ? (
          <FormControl fullWidth>
            <InputLabel id="case-select-label">Select Case</InputLabel>
              <Select
                labelId="case-select-label"
                fullWidth
                value={caseElem}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setCaseElem(event.target.value as number);
                  console.log("hi");
                  console.log(event);
                  console.log(caseElem);
                }}
              >

              {
                caseData.data.cases.filter((x: any) => x != null).map((caseE: ManagementCase) => (
                  <MenuItem key={caseE.id} value={caseE.id}>
                    {caseE.name}
                  </MenuItem>
                )) 
              }
            </Select>
          </FormControl>
        ) : fetching ? (
          "Loading Categories or none available."
        ) : null}

        {caseElem && data ? (
          <FormControl fullWidth>
              <InputLabel id="category-select-label" style = {{marginTop: "0.5rem"}}>Category</InputLabel>
              <Select
                style = {{marginTop: "1.5rem"}}
                labelId="category-select-label"
                fullWidth
                value={category}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setCategory(event.target.value as number);
                }}
              >
                {
                  data.category.filter((x: any) => x != null).map((category: ManagementCategory) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  )) 
                }
              </Select>
              <TextField
                id="standard-full-width"
                placeholder="New Case Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Select
                labelId="status-select-label"
                fullWidth
                value={"To Do"}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setStatus(event.target.value as string);
                }}
              >
                <MenuItem value={"To Do"}>To Do</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Done"}>Done</MenuItem>
              </Select>

              <MdEditor style={{ height: '400px', marginTop: '1rem'}} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} placeholder={'New text'} />
              <Box mt="10px" display="flex" justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    executeMutation({
                      id: caseElem,
                      description,
                      name,
                      status,
                      category
                    });
                    props.onClose();
                  }}
                >
                  Submit
                </Button>
              </Box>
          </FormControl>
          
        ) : null}
    </StyledModal>
  );
};
export default AddCaseModal;
