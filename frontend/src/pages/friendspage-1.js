{/* Requests Section */}
        <section className="space-y-8">
          {/* Incoming Friend Requests */}
          <div>
            <h3 className="text-xl font-semibold">Pending Friend Requests</h3>
            {incomingFriendReqs.length === 0 ? (
              <p className="text-sm opacity-70">No incoming friend requests.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(incomingFriendReqs || []).map((req) => (
                  <FriendCard key={req._id} friend={req.sender} />
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Friend Requests */}
          <div>
            <h3 className="text-xl font-semibold">Sent Requests</h3>
            {outgoingFriendReqs.length === 0 ? (
              <p className="text-sm opacity-70">No pending outgoing requests.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {outgoingFriendReqs.map((req) => (
                  <FriendCard
                    key={req._id}
                    friend={req.recipient}
                    requestSent={true} // ✅ Used to indicate 'Request Sent' status
                  />
                ))}
              </div>
            )}
          </div>
        </section>