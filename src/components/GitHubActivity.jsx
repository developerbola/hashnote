import React, { useState, useEffect, useRef } from "react";
import { months } from "../utils/dates";
import { useGithub } from "../context/GithubProvider";
// Fully styled GitHubActivity component
const GitHubActivity = () => {
  const [contributionData, setContributionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, token } = useGithub();
  const year = new Date().getFullYear();
  // Container ref for positioning
  const calendarRef = useRef(null);

  // Month labels

  // Function to determine color based on contribution count
  const getActivityColor = (count) => {
    if (count === 0) return "#ffffff10";
    if (count <= 4) return "#0e4429";
    if (count <= 8) return "#006d32";
    if (count <= 12) return "#26a641";
    return "#39d353";
  };

  // Fetch GitHub contribution data
  useEffect(() => {
    const fetchContributions = async () => {
      if (!username) {
        setLoading(false);
        setContributionData(generateSampleData());
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // GitHub GraphQL API query to get contribution data
        const query = `
          query {
            user(login: "${username}") {
              contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    firstDay
                    contributionDays {
                      date
                      contributionCount
                      weekday
                    }
                  }
                }
              }
            }
          }
        `;

        // Get GitHub token from props or environment
        const accessToken = token || process.env.REACT_APP_GITHUB_TOKEN;

        if (!accessToken) {
          console.warn(
            "No GitHub token provided. API calls may be rate-limited."
          );
        }

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (!result.data || !result.data.user) {
          throw new Error(
            "User not found or API returned unexpected data structure"
          );
        }

        const userData =
          result.data.user.contributionsCollection.contributionCalendar;

        // Validate data structure
        if (!userData.weeks || !Array.isArray(userData.weeks)) {
          throw new Error("Invalid contribution data format");
        }

        setContributionData(userData);
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        setError(`Failed to fetch data: ${err.message}`);
        // Use sample data as fallback
        setContributionData(generateSampleData());
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, year, token]);

  // Generate sample data for preview or when API fails
  const generateSampleData = () => {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    const dayCount =
      Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const weeks = [];
    let currentWeek = [];
    let currentDay = new Date(startDate);

    for (let i = 0; i < dayCount; i++) {
      if (currentDay.getDay() === 0 && currentWeek.length > 0) {
        weeks.push({
          firstDay: currentWeek[0].date,
          contributionDays: [...currentWeek],
        });
        currentWeek = [];
      }

      currentWeek.push({
        date: currentDay.toISOString().split("T")[0],
        contributionCount: Math.floor(Math.random() * 10),
        weekday: currentDay.getDay(),
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Add the final week
    if (currentWeek.length > 0) {
      weeks.push({
        firstDay: currentWeek[0].date,
        contributionDays: [...currentWeek],
      });
    }

    return {
      totalContributions: weeks.reduce(
        (sum, week) =>
          sum +
          week.contributionDays.reduce(
            (weekSum, day) => weekSum + day.contributionCount,
            0
          ),
        0
      ),
      weeks,
    };
  };

  if (loading) {
    return (
      <div className="github-calendar-loading">
        <span className="spinner-circle" />
      </div>
    );
  }

  if (error && !contributionData) {
    return (
      <div className="github-calendar-error">
        <h3>Error loading GitHub contributions</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Generate the calendar grid with proper week/day alignment
  const renderCalendar = () => {
    if (
      !contributionData ||
      !contributionData.weeks ||
      contributionData.weeks.length === 0
    ) {
      return (
        <div className="github-calendar-empty">
          No contribution data available
        </div>
      );
    }

    // Generate month labels
    const monthLabels = [];
    let currentMonth = -1;

    contributionData.weeks.forEach((week, weekIndex) => {
      // Check if firstDay is valid
      if (!week.firstDay) return;

      const date = new Date(week.firstDay);
      const month = date.getMonth();

      if (month !== currentMonth) {
        currentMonth = month;
        monthLabels.push(
          <div
            key={`month-${month}`}
            className="github-calendar-month"
            style={{ left: `${weekIndex * 12}px` }}
          >
            {months[month].slice(0, 3)}
          </div>
        );
      }
    });

    // Generate cells for each contribution day
    const cells = [];

    contributionData.weeks.forEach((week, weekIndex) => {
      // Some weeks might not have all days, especially at the beginning/end of year
      if (!week.contributionDays || !Array.isArray(week.contributionDays))
        return;

      week.contributionDays.forEach((day) => {
        // Make sure all required fields exist
        if (!day.date || day.contributionCount === undefined) return;

        const date = new Date(day.date);
        const formattedDate = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getDate()}, ${date.getFullYear()}`;
        const cellTooltip = `${day.contributionCount} contrb - ${formattedDate}`;

        // Use the weekday from the API if available, or calculate it
        const dayIndex =
          day.weekday !== undefined ? day.weekday : date.getDay();

        cells.push(
          <div
            key={`cell-${day.date}`}
            className="github-calendar-cell"
            data-date={day.date}
            data-count={day.contributionCount}
            style={{
              backgroundColor: getActivityColor(day.contributionCount),
              left: `${weekIndex * 12}px`,
              top: `${dayIndex * 12}px`,
            }}
            title={`${cellTooltip}`}
          />
        );
      });
    });

    return (
      <div className="github-calendar-container">
        <div className="github-calendar-months">{monthLabels}</div>
        <div className="github-calendar-grid">{cells}</div>
      </div>
    );
  };

  // Render the calendar, tooltip, and stats
  return (
    <div className="github-calendar" ref={calendarRef}>
      <div className="github-calendar-stats">
        Total: <strong>{contributionData?.totalContributions || 0}</strong>
      </div>

      <div className="github-calendar-wrapper">{renderCalendar()}</div>
    </div>
  );
};

export default GitHubActivity;
