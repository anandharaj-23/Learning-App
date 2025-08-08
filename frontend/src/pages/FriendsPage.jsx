import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUserFriends,
  getOutgoingFriendReqs,
  getFriendRequests,
} from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: async () => {
      const res = await getOutgoingFriendReqs();
      return Array.isArray(res) ? res : [];
    },
  });

  const { data: incomingFriendReqs = [] } = useQuery({
    queryKey: ["incomingFriendReqs"],
    queryFn: async () => {
      const res = await getFriendRequests();
      return Array.isArray(res) ? res : [];
    },
  });

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
        
      <div className="container mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default FriendsPage;
