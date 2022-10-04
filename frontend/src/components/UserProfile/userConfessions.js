import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserConfessions, getConfessions } from "../../store/confessions";
import ConfessionListing from "./confessionListing";
import bottleLogo from "../../assets/bottle pic.png";
import "./index.css";
import { _getCurrentUser } from "../../store/session";

const UserConfessions = () => {
  const dispatch = useDispatch();
  const user = useSelector(_getCurrentUser);
  const uConfessions = useSelector(getConfessions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchUserConfessions(user._id));
    const timer = setTimeout(function () {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [uConfessions.length]);

  const mapConfessions = () => {

      let confessions = uConfessions?.filter((conf) => conf.userId === user._id);
      return confessions.map((conf) => {
        return <ConfessionListing key={conf._id} conf={conf} />;
      });
    };
 

  return (
    <>
      <div className="user-confession-container">
        {isLoading ? (
          <div className="loading-container">
            <img className="logo-timer" src={bottleLogo}></img>
            <h1 className="loading-title">
              {" "}
              Quietly gathering your secrets...{" "}
            </h1>
          </div>
        ) : (
          <>
            <h1 className="user-conf-header">All your confessions</h1>
            <div className="mapped-conf">{mapConfessions()}</div>
          </>
        )}
      </div>
    </>
  );
};

export default UserConfessions;
