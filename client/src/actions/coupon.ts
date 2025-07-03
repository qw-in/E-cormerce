"use server";

import { createNewCouponRules } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectCoupontFormAction = async () => {
    const req = await request();
    const decision = await createNewCouponRules.protect(req);

    if (decision.isDenied()) {
        if (decision.reason.isBot()) {
            return {
                error: "Bot activity dentected",
                success: false,
                status: 403,
            };
        } else if (decision.reason.isRateLimit()) {
            return {
                error: "Too many request! Please try again",
                success: false,
                status: 403,
            };
        } else if (decision.reason.isShield()) {
            return {
                error: "Invalid activity detected",
                success: false,
                status: 403,
            };
        } else if (decision.reason.isSensitiveInfo()) {
            return {
                error: "Bad request - sensitive information detected",
                success: false,
                status: 403,
            };
        }
        return {
            error: "Forbidden",
            success: false,
            status: 403,
        };
    }
    return {
        success: true,
    };
};
