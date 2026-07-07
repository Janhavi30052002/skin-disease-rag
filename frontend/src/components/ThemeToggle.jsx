import { Moon, Sun } from "lucide-react";

import useTheme from "@/hooks/useTheme";

export default function ThemeToggle() {

    const { theme, toggleTheme } = useTheme();

    return (

        <button

            onClick={toggleTheme}

            className="

            w-11
            h-11

            rounded-xl

            flex
            items-center
            justify-center

            border

            border-slate-300
            dark:border-slate-700

            bg-white
            dark:bg-slate-900

            hover:scale-105

            transition-all
            duration-300

            shadow-sm
            "

        >

            {

                theme === "dark"

                    ? <Sun size={20}/>

                    : <Moon size={20}/>

            }

        </button>

    );

}