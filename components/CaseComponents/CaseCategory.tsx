import React from "react";
import { Container, Row, Col } from "reactstrap";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery, useMutation  } from "urql";
import CaseCard, { CaseData } from "./CaseCard";
import style from '../../styles/iconStyle';

type CaseCategoryProps = {
  category_id: number;
};

type CaseCategoryData = {
  name: string;
  cases: CaseData[];
};

/*
  ALTERNATE FEATURE 1 TODO:
  Use the data on tags found in props to render out all
  of the tags associated with every case.
*/
const CategoryQuery = `
  query CategoryQuery($category_id: bigint = "") {
    category(where: {id: {_eq: $category_id}}, limit: 1) {
      cases {
        name
        status
        description
        id
      }
      name
    }
}
`;
/* END TODO */

const CaseCategory = (props: CaseCategoryProps) => {
  const category_id = props.category_id;
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: CategoryQuery,
    variables: { category_id },
  });

  const category: CaseCategoryData | null = data ? data?.category[0] : null;

  return (
    <Container
      style={{ width: "100%", borderStyle: "solid", padding: "0.75rem" }}
    >
      <Row>
        <Col>
          {category ? (
            <h3 className="font-weight-normal t4sg-color text-center">
              {category.name}
            </h3>
          ) : (
            <h3 className="font-weight-normal t4sg-color text-center">
              Something went wrong
            </h3>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {category
            ? category.cases.map((c: CaseData, index: number) => {
                return <CaseCard key={index} data={c} />;
              }) : "Something went wrong"}
        </Col>
      </Row>
    </Container>
  );
};

export default CaseCategory;
