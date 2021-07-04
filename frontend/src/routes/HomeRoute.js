import NavigationBar from '../components/NavigationBar';
import PostBriefList from '../components/PostBriefList';

function HomeRoute(props) {

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar />
      {/* List of Posts */}
      <PostBriefList />
    </div>
  );
}

export default HomeRoute;
