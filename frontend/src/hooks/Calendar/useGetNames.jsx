import { useState } from "react";

export const useGetNames = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNames = async () => {
        try {
            const response = await fetch("http://localhost:8080/employee", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();
            if (!response.ok) {
                setIsLoading(false);
                setError(json.message || "Something went wrong");
                return;
            }
            setIsLoading(false);
            return json.rows;
        } catch (error) {
            console.log("Error getRoles", error);
            setIsLoading(false);
            setError("Error fetching all roles");
        }
    }

    return { fetchNames, isLoading, error };
}