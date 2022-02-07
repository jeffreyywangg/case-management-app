import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { useQuery, useMutation } from "urql";
import { Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { green } from "@material-ui/core/colors";
import style from '../../styles/iconStyle';
import ReactMarkdown from 'react-markdown';

type CaseCardProps = {
  data: CaseData;
};

export type TagData = {
  name: string;
  id?: number;
};

export type CaseData = {
  name: string;
  status: string;
  description: string;
  id: number;
  cases_tags?: [TagData];
};

const deleteQuery = `
mutation deleteQuery($id: bigint = "") {
  delete_cases_by_pk(id: $id) {
    id
    category_id
    description
    name
    status
  }
}
`;

const CaseCard: React.FC<CaseCardProps> = (props) => {
  const caseData = props.data;
  let [id, setId] = React.useState<number | null>(caseData.id);
  let [task, taskRemoved] = useMutation(deleteQuery);
  const [hover, setHover] = React.useState(false);

  // console.log("Card data");
  // console.log(caseData.id);
  // console.log(caseData.status);

  return (

    <Container>
      <div style={{ width: "100%", padding: "5px" }}>
        <Card body style={{ backgroundColor: "#e4ebf5", position: 'relative' }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <CardTitle tag="h3">{caseData.name}</CardTitle>
            <CloseIcon 
              onClick={() => {taskRemoved({id});}}
              onMouseEnter={()=>{
                setHover(true);
              }}
              onMouseLeave={()=>{
                setHover(false);
              }}
              style={{
                ...style.normal,
                ...(hover ? style.hover : null)
              }}
            /> 

      
          </Box>

          {/* <div style = {{
            position: 'absolute',
            top: '5px',
            right: '5px',
            color: caseData.status === 'In Progress' 
            ? 'rgba(0, 200, 10, 1)'
             : caseData.status === 'Done'
              ? 'rgba(0, 0, 150, 1)' 
                : caseData.status === 'To Do' 
                ? 'rgba(200, 200, 10, 1)': 
                  'black',
            fontSize: 'small'
          }}>
            <p>{caseData.status}</p>
          </div> */}

          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            backgroundColor: caseData.status === 'In Progress' 
              ? 'rgba(0, 200, 10, 1)'
               : caseData.status === 'Done'
                ? 'rgba(0, 0, 150, 1)' 
                : caseData.status === 'To Do' 
                ? 'rgba(230, 230, 50, 1)': 
                 'transparent',
          }} /> 

          {/* <CardSubtitle tag="h6" className="mb-2 text-muted"> </CardSubtitle> */}
          <ReactMarkdown>{caseData.description}</ReactMarkdown>
            
          {/*
            ALTERNATE FEATURE 1 TODO:
            Use the data on tags found in props to render out all
            of the tags associated with every case.
          */}

          {/* END TODO */}
        </Card>
      </div>
    </Container>
  );
};
export default CaseCard;
