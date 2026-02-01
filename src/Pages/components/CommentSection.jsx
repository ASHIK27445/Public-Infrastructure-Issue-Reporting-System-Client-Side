import React, { useState } from 'react';
import { User, Trash2, Reply, AlertTriangle, Loader2, CircleX, Check, Loader, LoaderCircle } from 'lucide-react';

const CommentSection= ({ 
  comment, mUser, role, replyingTo, replyText, replyLoading, onDeleteComment, 
  onReplyClick, onReplyTextChange, onReplySubmit, formatDate, commentDeleteLaoding }) => {
  
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div className="mb-6">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
            {comment.commenterPhoto ? (
              <img 
                src={comment.commenterPhoto} 
                alt={comment.commenterName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-white">{comment.commenterName}</div>
            <div className="text-xs text-gray-400">
              {comment.commenterRole} • {formatDate(comment.commentedAt)}
            </div>
          </div>
        </div>

        {/* Delete button */}
        {(mUser?._id === comment.commentby.toString() || role === 'admin') && (
          <div className="flex items-center space-x-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-red-500 hover:text-red-500 p-1"
                title="Delete"
              >
                <Trash2 className="text-red-500 w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Confirm delete */}
                <button
                  onClick={() => onDeleteComment(comment._id)}
                  className="text-emerald-500  p-1 border border-emerald-400 hover:bg-green-500 hover:font-bold hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 rounded-md"
                  title="Confirm delete">
                    {commentDeleteLaoding ? 
                    <LoaderCircle className='w-4 h-4 animate-spin'/> :
                    <Check className="w-4 h-4" />
                    }
                </button>

                {/* Cancel */}
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-red-500 p-1 border border-red-500 hover:bg-red-500 hover:font-bold hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 rounded-md"
                  title="Cancel"
                >
                  <CircleX className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Comment Text */}
      <div className="ml-12 mb-3">
        {comment.isToxic ? (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
            <div className="flex items-center text-red-400 mb-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">This comment has been hidden due to inappropriate content</span>
            </div>
            <div className="text-xs text-gray-400">
              Toxicity score: {(comment.toxicityScore * 100).toFixed(0)}%
            </div>
          </div>
        ) : (
          <p className="text-white bg-gray-800/50 rounded-lg p-3">
            {comment.commentText}
          </p>
        )}
      </div>

      {/* Reply Button */}
      <div className="ml-12 flex items-center space-x-4">
        <button
          onClick={() => onReplyClick(comment._id)}
          className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
        >
          <Reply className="w-4 h-4 mr-1" />
          Reply
        </button>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4">
          {comment.replies.map((reply, index) => (
            <div key={index} className="border-l-2 border-gray-700 pl-4">
              {/* Reply Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                    {reply.replierPhoto ? (
                      <img 
                        src={reply.replierPhoto} 
                        alt={reply.replierName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{reply.replierName}</div>
                    <div className="text-xs text-gray-400">
                      {reply.replierRole} • {formatDate(reply.repliedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Text */}
              <div className="ml-10">
                {reply.isToxic ? (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-2 text-sm">
                    <div className="flex items-center text-red-400">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <span className="text-xs">Hidden due to inappropriate content</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Toxicity: {(reply.toxicityScore * 100).toFixed(0)}%
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm bg-gray-800/30 rounded-lg p-2">
                    {reply.repliedText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {replyingTo === comment._id && (
        <div className="ml-12 mt-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              onKeyPress={(e) => e.key === 'Enter' && onReplySubmit(comment._id)}
            />
            <button
              onClick={() => onReplySubmit(comment._id)}
              disabled={!replyText.trim() || replyLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {replyLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection