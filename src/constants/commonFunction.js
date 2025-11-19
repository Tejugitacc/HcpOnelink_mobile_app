// import React from "react";

export const handleBack = (router) => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace("/dashboard");
    }
};
