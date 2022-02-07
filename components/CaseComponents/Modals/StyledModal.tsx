import Modal from "@material-ui/core/Modal";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import React from "react";
import { useQuery } from "urql";

type StyledModalProps = {
  open: boolean;
  onClose: () => void;
};

const StyledModal: React.FC<StyledModalProps> = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px" }}
    >
      <Card
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          width: 800,
          paddingTop: "0.75em",
          paddingBottom: "0.75em",
          backgroundColor: "#FFFEF2",
        }}
      >
        <Container>
          <>{props.children}</>
        </Container>
      </Card>
    </Modal>
  );
};
export default StyledModal;
