# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE

module GenerateLocales
	def self.generate

		I18n::JS::export
		File.open(Rails.root.join('app', 'javascript', 'i18n', 'locales', 'index.ts'), 'w') do |file|
			file << "// DO NOT MODIFY THIS FILE. AUTOGENERATED\n"
			file << "const translations:Record<string,any> = {};\n\n"
			I18n::JS::translations.select{|k,v| Houdini.intl.available_locales.map{|i| i.to_s}.include?(k.to_s)}.keys.each do |k|
				file << "translations['#{k}'] = require('./#{k}').default['#{k}'];\n"
			end

			file << "\nexport default translations;"
		end
	end
end