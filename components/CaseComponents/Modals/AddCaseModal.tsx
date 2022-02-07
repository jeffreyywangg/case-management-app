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

/* 
  FEATURE 2 TODO:
  Write a mutation that will insert (add) a new case given the
  description, name, status, and category_id.
*/
const InsertCaseMutation = `
  mutation InsertCaseMutation($description: String = "", $name: String = "", $status: String = "", $category_id: Int = 0) {
    insert_cases_one(object: {description: $description, , name: $name, status: $status, category_id: $category_id}) {
      description
      id
      category_id
      name
      status
    }
  }  
`;

const AddCaseModal: React.FC<AddCaseModalProps> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: ManagementContainerQuery,
  });
  const [result, executeMutation] = useMutation(InsertCaseMutation);
  const [markdown, setMarkdown] = useState<string>("");

  // Initialize a markdown parser
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  // Finish!
  function handleEditorChange({ html, text }) {
    setDescription(text);
  }

  return (
    
    <StyledModal open={props.open} onClose={props.onClose}>
      <Typography variant="h4" align="center">
        Add New Case
      </Typography>
      <Box>
        <TextField
          id="standard-full-width"
          label="Name"
          placeholder="Example Case Name"
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
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            fullWidth
            value={status}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setStatus(event.target.value as string);
            }}
          >
            <MenuItem value={"To Do"}>To Do</MenuItem>
            <MenuItem value={"In Progress"}>In Progress</MenuItem>
            <MenuItem value={"Done"}>Done</MenuItem>
          </Select>
        </FormControl>
        {data ? (
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                fullWidth
                value={category}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setCategory(event.target.value as number);
                }}
              >
              
              {/*
                FEATURE 2 TODO:
                Use the data from the result of the query ManagementContainerQuery
                to render a MenuItem with category id as the value, and the 
                category name as the text.
              */}

              {
                data.category.filter(x => x != null).map((category: ManagementCategory) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                )) 
              }

            </Select>
          </FormControl>
        ) : fetching ? (
          "Loading Categories or none available."
        ) : null}
        <MdEditor style={{ height: '400px', marginTop: '1rem'}} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} placeholder={'Enter description here'} />
        
        {/* <TextField
          id="standard-full-width"
          label="Description"
          placeholder="Example Case Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDescription(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        /> */}

      </Box>
      <Box mt="10px" display="flex" justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => {
            executeMutation({
              description,
              name,
              status,
              category_id: category,
            });
            props.onClose();
            window.location.reload();
          }}
        >
          Submit
        </Button>
      </Box>
    </StyledModal>
  );
};
export default AddCaseModal;
