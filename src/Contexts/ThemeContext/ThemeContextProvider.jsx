import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [themeFloatingLabel, setThemeFloatingLabel] = useState({});
  const [themeDatepicker, setThemeDatepicker] = useState({});
  const [themeDropdownForAvator, setthemeDropdownForAvator] = useState({});
  const [themeSelect, setThemeSelect] = useState({});

  useEffect(() => {
    if (isDark) {
      setThemeFloatingLabel({
        label: {
          default: {
            outlined: {
              sm: " dark:bg-gray-800 bg-gray-800 ",
              md: " dark:bg-gray-800 bg-gray-800 ",
            },
          },
        },
      });
      setThemeDatepicker({
        root: {
          input: {
            field: {
              input: {
                colors: {
                  gray: "dark:text-white dark:bg-gray-700 text-white bg-gray-700",
                },
              },
            },
          },
        },
        popup: {
          root: {
            base: "absolute top-10 z-50 block pt-2",
            inline: "relative top-0 z-auto",
            inner:
              "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800",
          },
        },
      });
      setThemeSelect({
        field: {
          select: {
            colors: {
              gray: "dark:text-white text-white dark:bg-gray-700 bg-gray-700",
            },
          },
        },
      });
      setthemeDropdownForAvator({
        floating: {
          header: " dark:text-gray-200 text-gray-200 ",
          item: {
            container: "",
            base: "text-gray-400 dark:text-gray-400 hover:bg-green-700 dark:hover:bg-green-700 hover:text-white dark:hover:text-white focus:bg-green-700 dark:focus:bg-green-700 focus:text-white dark:focus:text-white",
          },
          style: {
            dark: " bg-black  dark:bg-black text-white  dark:text-white ",
            light: " bg-black dark:bg-black text-white dark:text-white ",
            auto: " bg-black dark:bg-black text-white dark:text-white ",
          },
          target: "w-fit",
        },
      });
    } else {
      setThemeFloatingLabel({
        input: {
          default: {
            outlined: { sm: "dark:text-black", md: "dark:text-black" },
          },
        },
        label: {
          default: {
            outlined: {
              sm: " dark:bg-white bg-white ",
              md: " dark:bg-white bg-white ",
            },
          },
        },
      });
      setThemeDatepicker({
        root: {
          input: {
            field: {
              input: {
                colors: {
                  gray: "dark:text-gray-700 dark:bg-gray-100 text-white bg-gray-100",
                },
              },
            },
          },
        },
        popup: {
          root: {
            base: "absolute top-10 z-50 block pt-2",
            inline: "relative top-0 z-auto",
            inner:
              "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800",
          },
        },
      });
      setThemeSelect({
        field: {
          select: {
            colors: {
              gray: "dark:text-gray-700 dark:bg-gray-100 text-gray-700 bg-gray-100",
            },
          },
        },
      });
      setthemeDropdownForAvator({
        floating: {
          header: " text-gray-800 dark:text-gray-800 ",
          item: {
            container: "",
            base: "text-gray-600 dark:text-gray-600 hover:bg-green-700 dark:hover:bg-green-700 hover:text-white dark:hover:text-white focus:bg-green-700 dark:focus:bg-green-700 focus:text-white dark:focus:text-white",
          },
          style: {
            dark: " bg-black  dark:bg-black text-white  dark:text-white ",
            light: " bg-black dark:bg-black text-white dark:text-white ",
            auto: " bg-gray-200 dark:bg-gray-200 text-gray-600 dark:text-gray-700 ",
          },
          target: "w-fit",
        },
      });
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        themeFloatingLabel,
        themeDatepicker,
        themeSelect,
        themeDropdownForAvator,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
