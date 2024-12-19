import React, { useEffect, useState } from 'react';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const UserMenu = ({ centered }) => {
  const getData = useStore(state => state.getData);
  const user = useStore(state => state.user);
  const logIn = useStore(state => state.logIn);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);
  
  const [allLogins, setAllLogins] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (user.subLogin) {
      setAllLogins(prev => {
        const allUsers = [...prev, user, ...user.subLogin];
        const uniqueUsers = Array.from(
          new Map(allUsers.map(item => [item.uid, item])).values()
        );
        return uniqueUsers.sort((a, b) => a.login.localeCompare(b.login));
      });
    }
  }, [user.subLogin]);

  const handleSwitchUser = async (loginUser) => {
    if (loginUser.uid === user.uid) return;
    
    let result;
    try {
      setLoader(true);
      result = await logIn(loginUser.login, loginUser.password);
      await getData(loginUser.uid);
      setIsExpanded(false);
    } catch (error) {
      console.error("Switch user error:", error);
      showAllert(1, "Помилка при зміні логіну");
    } finally {
      if (result?.flag) {
        showAllert(2, `Обліковий запис ${loginUser.login}`);
      }
      setLoader(false);
    }
  };

  const renderActiveUser = () => (
    <div 
      className="flex items-center gap-2 px-3 py-2 bg-slate-800/90 backdrop-blur-sm rounded-lg cursor-pointer 
                 hover:bg-slate-700/90 transition-all duration-300 border border-slate-600/50"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white lowercase">{user.login}</span>
        <span className="text-xs text-slate-300">{user.name}</span>
      </div>
      <svg
        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const renderUserList = () => {
    if (!isExpanded || !allLogins.length) return null;

    return (
      <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg shadow-black/50 
                      border border-slate-600/50 z-50 overflow-hidden">
        <div className="py-2">
          {allLogins.map((loginUser) => (
            <button
              key={loginUser.uid}
              onClick={() => handleSwitchUser(loginUser)}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors duration-200
                ${loginUser.uid === user.uid 
                  ? 'bg-slate-700/70 text-white font-medium' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }
              `}
            >
              <div className="flex flex-col">
                <span>{loginUser.login}</span>
                <span className="text-xs text-slate-400">{loginUser.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative inline-block text-left ${centered ? 'absolute left-1/2 -translate-x-1/2 top-[-90px]' : ''}`}>
      {renderActiveUser()}
      {renderUserList()}
    </div>
  );
};

export default UserMenu;