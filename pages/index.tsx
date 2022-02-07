import Layout from "../components/Layout/Layout";
import CaseManagementContainer from "../components/CaseComponents/CaseManagementContainer";
import Footer from "../components/CaseComponents/Footer"

const Index = () => {
  return (
    <Layout pageTitle="Case Manager">
      <CaseManagementContainer />
      <Footer />
    </Layout>
  );
};
export default Index;
