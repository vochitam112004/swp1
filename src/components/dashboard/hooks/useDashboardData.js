// Custom hook for dashboard data management
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../../api/axios";
import { safeParse } from "../utils/dashboardUtils";
import { ApiHelper } from "../../../utils/apiHelper";

export const useDashboardData = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [memberProfile, setMemberProfile] = useState(null);
  const [smokingStatus, setSmokingStatus] = useState("");
  const [quitAttempts, setQuitAttempts] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState(0);
  const [previousAttempts, setPreviousAttempts] = useState("");
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);
  // New smoking habits states - updated according to API
  const [cigarettesSmoked, setCigarettesSmoked] = useState(0);
  const [dailyCigarettes, setDailyCigarettes] = useState(0);
  const [yearsOfSmoking, setYearsOfSmoking] = useState(0);
  const [pricePerPack, setPricePerPack] = useState(25000);
  const [packPrice, setPackPrice] = useState(25000);
  const [health, setHealth] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [previousHealthIssues, setPreviousHealthIssues] = useState("");
  const [smokingTriggers, setSmokingTriggers] = useState("");
  const [preferredBrand, setPreferredBrand] = useState("");
  const [smokingPattern, setSmokingPattern] = useState("");
  const [personalMotivation, setPersonalMotivation] = useState("");
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
    if (authLoading || !user) return;
    const checkMembership = async () => {
      try {
        const res = await api.get("/UserMemberShipHistory/my-history");
        if (res.data && res.data.length > 0) {
          setHasMembership(true);
        } else {
          // Don't immediately redirect - let user see dashboard first
          setHasMembership(false);
          console.warn("User doesn't have membership");
          // Optional: show a toast instead of immediate redirect
          // toast.warning("Bạn chưa mua gói. Vui lòng mua để sử dụng!");
          // navigate("/membership");
        }
      } catch (error) {
        console.error("Lỗi kiểm tra gói:", error);
        // Don't redirect to login on membership check error
        setHasMembership(false);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [navigate, user, authLoading]);

  // Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/MemberProfile/GetMyMemberProfile");
      console.log("📦 MemberProfile:", res.data);
      if (res.data && res.data.memberId) {
        setMemberProfile(res.data);
        setSmokingStatus(res.data.smokingStatus || "");
        setQuitAttempts(res.data.quitAttempts || 0);
        setExperienceLevel(res.data.experience_level || 0);
        setPreviousAttempts(res.data.previousAttempts || "");

        // Set new smoking habits data
        setCigarettesSmoked(res.data.cigarettesSmoked || 0);
        setDailyCigarettes(res.data.dailyCigarettes || 0);
        setYearsOfSmoking(res.data.yearsOfSmoking || 0);
        setPackPrice(res.data.packPrice || res.data.pricePerPack || 25000);
        setCigarettesPerPack(res.data.cigarettesPerPack || 20);

        // Set health information
        setHealthConditions(res.data.healthConditions || "");
        setAllergies(res.data.allergies || "");
        setMedications(res.data.medications || "");
        setPreviousHealthIssues(res.data.previousHealthIssues || "");

        // Set additional smoking details
        setSmokingTriggers(res.data.smokingTriggers || "");
        setPreferredBrand(res.data.preferredBrand || "");
        setSmokingPattern(res.data.smokingPattern || "");
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
      const { progressLogs, currentGoal, goalPlan, errors } = await ApiHelper.fetchAllDashboardData();

      setProgressLogs(progressLogs);
      setCurrentGoal(currentGoal);
      setPlan(goalPlan);

      // Log any errors that occurred during fetching but don't show user errors for optional data
      if (errors.length > 0) {
        console.warn("⚠️ Some data could not be loaded:", errors);
        // Only show error if critical data failed
        const criticalErrors = errors.filter(error =>
          !error.includes("progress logs") && !error.includes("appointment")
        );
        if (criticalErrors.length > 0) {
          toast.warn("Một số dữ liệu quan trọng không thể tải được");
        }
      }
    } catch (err) {
      console.error("❌ Critical error fetching dashboard data:", err);
      toast.error("Không thể tải dữ liệu dashboard");
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

  // Fetch plan history
  const fetchPlanHistory = async () => {
    try {
      const history = await ApiHelper.fetchPlanHistory();
      setPlanHistory(history);
    } catch (error) {
      console.error("Lỗi lấy lịch sử kế hoạch:", error);
      setPlanHistory([]);
    }
  };

  // Gọi hàm này trong useEffect khi user đã đăng nhập:
  useEffect(() => {
    if (!authLoading && user) {
      fetchPlanHistory();
    }
  }, [user, authLoading]);

  // Gọi hàm này trong useEffect khi user đã đăng nhập:
  useEffect(() => {
    if (!authLoading && user) {
      fetchPlanHistory();
    }
  }, [user, authLoading]);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/Appointment/MyAppointments");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Appointment Error:", error);
      // Set empty array if API fails - this prevents the error from blocking other functionality
      setAppointments([]);
      // Don't show toast error for optional data
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [])

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
    // New smoking habits states - updated according to API
    cigarettesSmoked,
    dailyCigarettes,
    yearsOfSmoking,
    pricePerPack,
    packPrice,
    health,
    healthConditions,
    allergies,
    medications,
    previousHealthIssues,
    smokingTriggers,
    preferredBrand,
    smokingPattern,
    personalMotivation,
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
    // New setters - updated according to API
    setCigarettesSmoked,
    setDailyCigarettes,
    setYearsOfSmoking,
    setPricePerPack,
    setPackPrice,
    setHealth,
    setHealthConditions,
    setAllergies,
    setMedications,
    setPreviousHealthIssues,
    setSmokingTriggers,
    setPreferredBrand,
    setSmokingPattern,
    setPersonalMotivation,
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
    fetchPlanHistory,
    deleteGoalPlan: ApiHelper.deleteGoalPlan,
  };
};
