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
import { CategoryOutlined } from "@material-ui/icons";

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

const RemoveCategoryMutation = `
mutation MyMutation($id: bigint = "") {
    delete_category_by_pk(id: $id) {
      description
      id
      name
    }
  }
`;

const DeleteCategoryModal:  React.FC<AddCaseModalProps> = (props) => {
    const [category, setCategory] = useState<number | null>(0);
    const [id, setId] = useState<number | null>(0);
    const [result, executeMutation] = useMutation(RemoveCategoryMutation);
    const [{ data, fetching, error }, executeQuery] = useQuery({
        query: ManagementContainerQuery,
      });

    return (
        <StyledModal open={props.open} onClose={props.onClose}>
            <Typography variant="h5" align="center">
                Delete A Category
            </Typography>

            {data ? (
                <FormControl fullWidth>
                    <Select
                        labelId="category-select-label"
                        fullWidth
                        value={category}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                            setCategory(event.target.value as number);
                            setId(event.target.value as number);
                            console.log(event.target.value as number);
                        }}
                    >
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
                "Loading Categories"
            ) : null}

            <Box mt="10px" display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    onClick={() => {
                        console.log(category);
                        executeMutation({
                            id
                        });
                     props.onClose();
                    }}
                    >
                    Submit
                </Button>
            </Box>
        </StyledModal>
    );
}

export default DeleteCategoryModal;


