import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import AllServices from "./pages/Tables/AllServices";
import AllCategories from "./pages/Tables/AllCategories";
import NewServiceForm from "./pages/Forms/NewServiceForm";
import EditServiceForm from "./pages/Forms/EditServiceForm";
import EditCategoryForm from "./pages/Forms/EditCategoryForm";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AddCategory from "./pages/Forms/NewCategoryForm";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          Dashboard Layout
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/new-service" element={<NewServiceForm />} />
            <Route path="/edit-service/:id" element={<EditServiceForm />} />
            <Route path="/new-category" element={<AddCategory />} />
            <Route path="/edit-category/:id" element={<EditCategoryForm />} />

            {/* Tables */}
            <Route path="/all-services" element={<AllServices />} />
            <Route path="/all-categories" element={<AllCategories />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} /> */}
            {/* <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
