# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH Web-Template-Output-Additional-Permission-3.0-or-later
FactoryBot.define do
  factory :profile do
    sequence(:email) { |n| "eric#{n}@fjelkt.com" }
    user
  end
end
