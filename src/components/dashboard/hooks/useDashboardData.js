// Custom hook for dashboard data management
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../../api/axios";
import { safeParse } from "../utils/dashboardUtils";

export const useDashboardData = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [memberProfile, setMemberProfile] = useState(null);
  const [smokingStatus, setSmokingStatus] = useState("");
  const [quitAttempts, setQuitAttempts] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [previousAttempts, setPreviousAttempts] = useState("");
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);
  const [appointments, setAppointments] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [planHistory, setPlanHistory] = useState([]);
  const [achievedBadges, setAchievedBadges] = useState([]);
  const [hasMembership, setHasMembership] = useState(false);
  const [progressLogs, setProgressLogs] = useState([]);
  const [progress, setProgress] = useState({
    daysNoSmoke: 0,
    moneySaved: 0,
    health: 0,
  });
  const [plan, setPlan] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Check membership
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const res = await api.get("/UserMemberShipHistory/my-history");
        if (res.data && res.data.length > 0) {
          setHasMembership(true);
        } else {
          toast.warning("Bạn chưa mua gói. Vui lòng mua để sử dụng!");
          navigate("/membership");
        }
      } catch (error) {
        console.error("Lỗi kiểm tra gói:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [navigate]);

  // Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/MemberProfile");
      console.log("📦 MemberProfile:", res.data);
      if (res.data && res.data.memberId) {
        setMemberProfile(res.data);
        setSmokingStatus(res.data.smokingStatus || "");
        setQuitAttempts(res.data.quitAttempts || 0);
        setExperienceLevel(res.data.experience_level || 0);
        setPreviousAttempts(res.data.previousAttempts || "");
      } else {
        toast.warn("Không tìm thấy hồ sơ cá nhân.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch MemberProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all dashboard data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        progressLogRes,
        currentGoalRes,
        goalPlanRes,
      ] = await Promise.all([
        api.get("/ProgressLog/GetProgress-logs"),
        api.get("/CurrentGoal"),
        api.get("/GoalPlan/current-goal"),
      ]);

      setProgressLogs(progressLogRes.data);
      setCurrentGoal(currentGoalRes.data);
      setPlan(goalPlanRes.data || null);
    } catch (err) {
      console.error("❌ Lỗi khi fetch dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch coach list
  const fetchCoachList = async () => {
    if (!user?.id) return;
    
    try {
      const res = await api.get("/ChatMessage/available-contacts");
      setCoachList(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách coach:", err);
      toast.error("Không lấy được danh sách coach!");
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/Appointment/GetAppointments");
      setAppointments(res.data);
    } catch {
      toast.error("Lấy lịch hẹn thất bại!");
    }
  };

  // Effects
  useEffect(() => {
    if (!authLoading && user && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchProfile();
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchCoachList();
  }, [user]);

  return {
    // State
    loading,
    memberProfile,
    smokingStatus,
    quitAttempts,
    experienceLevel,
    previousAttempts,
    cigarettesPerPack,
    appointments,
    coachList,
    planHistory,
    achievedBadges,
    hasMembership,
    progressLogs,
    progress,
    plan,
    currentGoal,
    
    // Setters
    setMemberProfile,
    setSmokingStatus,
    setQuitAttempts,
    setExperienceLevel,
    setPreviousAttempts,
    setCigarettesPerPack,
    setAppointments,
    setCoachList,
    setPlanHistory,
    setAchievedBadges,
    setProgressLogs,
    setProgress,
    setPlan,
    setCurrentGoal,
    
    // Functions
    fetchProfile,
    fetchAllData,
    fetchCoachList,
    fetchAppointments,
  };
};
