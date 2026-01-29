import { useMutation } from "@tanstack/react-query";

export const useCuration = () => {
  return useMutation({
    mutationKey: ["curationData"],
    mutationFn: async (queryData: any) => {
      const response = await fetch(
        "https://gcor4a6ukb.execute-api.eu-west-2.amazonaws.com/query", // TODO: move to env variable
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryData),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
