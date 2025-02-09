import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import React from "react"

function Workspace() {

    return (
        <div className="px-3 py-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <ChatView />
                <div className="md:col-span-3">
                    <CodeView />
                </div>
            </div>

        </div>
    )
};

export default Workspace;